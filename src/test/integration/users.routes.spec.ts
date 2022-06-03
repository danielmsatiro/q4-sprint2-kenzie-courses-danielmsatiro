import { generateCourse, generateToken, generateUser } from "..";
import { Course, User } from "../../entities";
import supertest from "supertest";
import app from "../../app";
import { validate } from "uuid";
import { DataSource } from "typeorm";
import AppDataSource from "../../data-source";
import { verify } from "jsonwebtoken";

describe("Create user route | Integration Test", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  const user: Partial<User> = generateUser();

  it("Return: User as JSON response | Status code: 201", async () => {
    const response = await supertest(app)
      .post("/users")
      .send({ ...user });

    const { password, ...newUser } = user;

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(["courses"]);
    expect(response.body).toHaveProperty(["updatedAt"]);
    expect(response.body).toHaveProperty(["createdAt"]);
    expect(validate(response.body.id)).toBeTruthy();
    expect(response.body).toEqual(expect.objectContaining({ ...newUser }));
  });

  it("Return: Body error, missing password | Status code: 400", async () => {
    const { password, ...newUser } = user;

    const response = await supertest(app)
      .post("/users")
      .send({ ...newUser });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: ["password is a required field"],
    });
  });

  it("Return: Body error, user already exists | Status code: 409", async () => {
    const response = await supertest(app)
      .post("/users")
      .send({ ...user });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "Email already exists",
    });
  });
});

describe("Login user route | Integration Test", () => {
  let connection: DataSource;

  const user: Partial<User> = generateUser();

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    await supertest(app)
      .post("/users")
      .send({ ...user });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: token as JSON response | Status code: 200", async () => {
    const { email, password } = user;

    const response = await supertest(app)
      .post("/login")
      .send({ email, password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(verify(response.body.token, process.env.SECRET_KEY)).toBeTruthy();
  });

  it("Return: Body error, invalid credentials | Status code: 401", async () => {
    const { email } = user;

    const response = await supertest(app)
      .post("/login")
      .send({ email, password: "wrongPassword" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "Invalid credentials",
    });
  });
});

describe("Get users route | Integration Test", () => {
  let connection: DataSource;

  let user: Partial<User> = generateUser();

  beforeEach(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  afterEach(async () => {
    await connection.destroy();
  });

  it("Return: Users as JSON response | Status code: 200", async () => {
    const res = await supertest(app)
      .post("/users")
      .send({ ...user, isAdm: true });

    const token = generateToken(res.body.id);

    const resUsers = await supertest(app)
      .get("/users")
      .set("Authorization", "Bearer " + token);

    const { password, ...newUser } = user;

    expect(resUsers.status).toBe(200);
    expect(resUsers.body).toBeInstanceOf(Array);
    expect(resUsers.body[0]).toEqual(expect.objectContaining({ ...newUser }));
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const response = await supertest(app).get("/users");
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "Missing authorization token.",
    });
  });

  it("Return: Body error, no permision | Status code: 401", async () => {
    const res = await supertest(app)
      .post("/users")
      .send({ ...user });

    const token = generateToken(res.body.id);

    const resUsers = await supertest(app)
      .get("/users")
      .set("Authorization", "Bearer " + token);

    expect(resUsers.status).toBe(401);
    expect(resUsers.body).toHaveProperty("message");
    expect(resUsers.body).toStrictEqual({
      message: "You are not allowed to access this information",
    });
  });
});

describe("Get only user route | Integration Test", () => {
  let connection: DataSource;

  let user: Partial<User> = generateUser();

  beforeEach(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  afterEach(async () => {
    await connection.destroy();
  });

  it("Return: Users as JSON response | Status code: 200", async () => {
    const res = await supertest(app)
      .post("/users")
      .send({ ...user });

    const token = generateToken(res.body.id);

    const response = await supertest(app)
      .get(`/users/${res.body.id}`)
      .set("Authorization", "Bearer " + token);

    const { password, ...newUser } = user;

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ ...newUser }));
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const res = await supertest(app)
      .post("/users")
      .send({ ...user });

    const response = await supertest(app).get(`/users/${res.body.id}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "Missing authorization token.",
    });
  });

  it("Return: Body error, no permision | Status code: 403", async () => {
    const requester = await supertest(app)
      .post("/users")
      .send({ ...user });

    const token = generateToken(requester.body.id);

    const userTarget = await supertest(app)
      .post("/users")
      .send({ ...generateUser() });

    const response = await supertest(app)
      .get(`/users/${userTarget.body.id}`)
      .set("Authorization", "Bearer " + token);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "You can't access information of another user",
    });
  });
});

describe("Update user route | Integration Test", () => {
  let connection: DataSource;

  let user: Partial<User> = generateUser();

  beforeEach(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  afterEach(async () => {
    await connection.destroy();
  });

  it("Return: User as JSON response | Status code: 200", async () => {
    const requester = await supertest(app)
      .post("/users")
      .send({ ...user });

    const token = generateToken(requester.body.id);

    const newInformation = generateUser();

    const response = await supertest(app)
      .patch(`/users/${requester.body.id}`)
      .set("Authorization", "Bearer " + token)
      .send({ ...newInformation });

    const { password, ...userUpdated } = newInformation;

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ ...userUpdated }));
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const requester = await supertest(app)
      .post("/users")
      .send({ ...user });

    const newInformation = generateUser();

    const response = await supertest(app)
      .patch(`/users/${requester.body.id}`)
      .send({ ...newInformation });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "Missing authorization token.",
    });
  });

  it("Return: Body error, no permision | Status code: 403", async () => {
    const requester = await supertest(app)
      .post("/users")
      .send({ ...user });

    const token = generateToken(requester.body.id);

    const userTarget = await supertest(app)
      .post("/users")
      .send({ ...generateUser() });

    const response = await supertest(app)
      .patch(`/users/${userTarget.body.id}`)
      .set("Authorization", "Bearer " + token)
      .send({ ...generateUser() });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "You can't access information of another user",
    });
  });
});

describe("Subscribe user route | Integration Test", () => {
  let connection: DataSource;

  let user: Partial<User> = generateUser();
  let course: Partial<Course> = generateCourse();

  beforeEach(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  afterEach(async () => {
    await connection.destroy();
  });

  it("Return: User as JSON response | Status code: 200", async () => {
    const requester = await supertest(app)
      .post("/users")
      .send({ ...user });

    const token = generateToken(requester.body.id);

    const adm = await supertest(app)
      .post("/users")
      .send({ ...generateUser(), isAdm: true });

    const tokenAdm = generateToken(adm.body.id);

    const newCourse = await supertest(app)
      .post("/courses")
      .set("Authorization", "Bearer " + tokenAdm)
      .send({ ...course });

    const response = await supertest(app)
      .patch(`/users/subscribe/${requester.body.id}`)
      .set("Authorization", "Bearer " + token)
      .send({ courseId: newCourse.body.id });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ ...requester.body, courses: [newCourse.body] })
    );
  });

  it("Return: Another User as JSON response if requester is administrator | Status code: 200", async () => {
    const requester = await supertest(app)
      .post("/users")
      .send({ ...user, isAdm: true });

    const token = generateToken(requester.body.id);

    const userTarget = await supertest(app)
      .post("/users")
      .send({ ...generateUser() });

    const newCourse = await supertest(app)
      .post("/courses")
      .set("Authorization", "Bearer " + token)
      .send({ ...course });

    const response = await supertest(app)
      .patch(`/users/subscribe/${userTarget.body.id}`)
      .set("Authorization", "Bearer " + token)
      .send({ courseId: newCourse.body.id });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ ...userTarget.body, courses: [newCourse.body] })
    );
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const requester = await supertest(app)
      .post("/users")
      .send({ ...user });

    const adm = await supertest(app)
      .post("/users")
      .send({ ...generateUser(), isAdm: true });

    const tokenAdm = generateToken(adm.body.id);

    const newCourse = await supertest(app)
      .post("/courses")
      .set("Authorization", "Bearer " + tokenAdm)
      .send({ ...course });

    const response = await supertest(app)
      .patch(`/users/subscribe/${requester.body.id}`)
      .send({ courseId: newCourse.body.id });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "Missing authorization token.",
    });
  });

  it("Return: Body error, no permision | Status code: 403", async () => {
    const requester = await supertest(app)
      .post("/users")
      .send({ ...user });

    const token = generateToken(requester.body.id);

    const userTarget = await supertest(app)
      .post("/users")
      .send({ ...generateUser() });

    const adm = await supertest(app)
      .post("/users")
      .send({ ...generateUser(), isAdm: true });

    const tokenAdm = generateToken(adm.body.id);

    const newCourse = await supertest(app)
      .post("/courses")
      .set("Authorization", "Bearer " + tokenAdm)
      .send({ ...course });

    const response = await supertest(app)
      .patch(`/users/subscribe/${userTarget.body.id}`)
      .set("Authorization", "Bearer " + token)
      .send({ courseId: newCourse.body.id });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "You can't access information of another user",
    });
  });
});
