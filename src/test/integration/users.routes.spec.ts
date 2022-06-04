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

  let userAdm: User;
  let userNotAdm: User;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const date = new Date();
    const userRepo = connection.getRepository(User);
    userAdm = await userRepo.save({
      ...generateUser(),
      isAdm: true,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
    userNotAdm = await userRepo.save({
      ...generateUser(),
      isAdm: false,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: Users as JSON response | Status code: 200", async () => {
    const token = generateToken(userAdm.id);

    const resUsers = await supertest(app)
      .get("/users")
      .set("Authorization", "Bearer " + token);

    const { password, ...user } = userAdm;

    expect(resUsers.status).toBe(200);
    expect(resUsers.body).toBeInstanceOf(Array);
    expect(resUsers.body[0]).toEqual(expect.objectContaining({ ...user }));
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
    const token = generateToken(userNotAdm.id);

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

  let userAdm: User;
  let userNotAdm: User;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const date = new Date();
    const userRepo = connection.getRepository(User);
    userAdm = await userRepo.save({
      ...generateUser(),
      isAdm: true,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
    userNotAdm = await userRepo.save({
      ...generateUser(),
      isAdm: false,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: Users as JSON response | Status code: 200", async () => {
    const token = generateToken(userNotAdm.id);

    const response = await supertest(app)
      .get(`/users/${userNotAdm.id}`)
      .set("Authorization", "Bearer " + token);

    const { password, ...user } = userNotAdm;

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ ...user }));
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const response = await supertest(app).get(`/users/${userNotAdm.id}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "Missing authorization token.",
    });
  });

  it("Return: Body error, no permision | Status code: 403", async () => {
    const token = generateToken(userNotAdm.id);

    const response = await supertest(app)
      .get(`/users/${userAdm.id}`)
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

  let userAdm: User;
  let userNotAdm: User;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const date = new Date();
    const userRepo = connection.getRepository(User);
    userAdm = await userRepo.save({
      ...generateUser(),
      isAdm: true,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
    userNotAdm = await userRepo.save({
      ...generateUser(),
      isAdm: false,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: User as JSON response | Status code: 200", async () => {
    const token = generateToken(userNotAdm.id);

    const newInformation = generateUser();

    const response = await supertest(app)
      .patch(`/users/${userNotAdm.id}`)
      .set("Authorization", "Bearer " + token)
      .send({ ...newInformation });

    const { password, ...userUpdated } = newInformation;

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ ...userUpdated }));
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const newInformation = generateUser();

    const response = await supertest(app)
      .patch(`/users/${userNotAdm.id}`)
      .send({ ...newInformation });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "Missing authorization token.",
    });
  });

  it("Return: Body error, no permision | Status code: 403", async () => {
    const token = generateToken(userNotAdm.id);

    const response = await supertest(app)
      .patch(`/users/${userAdm.id}`)
      .set("Authorization", "Bearer " + token)
      .send({ ...generateUser() });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "You can't access information of another user",
    });
  });

  it("Return: Body error, updating email to other that exists | Status code: 409", async () => {
    const token = generateToken(userNotAdm.id);

    const newInformation = { ...generateUser(), email: userAdm.email };

    const response = await supertest(app)
      .patch(`/users/${userNotAdm.id}`)
      .set("Authorization", "Bearer " + token)
      .send({ ...newInformation });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "User already exists",
    });
  });
});

describe("Subscribe user route | Integration Test", () => {
  let connection: DataSource;

  let userAdm: User;
  let userNotAdm: User;
  let newCourse: Course;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const date = new Date();
    const userRepo = connection.getRepository(User);
    userAdm = await userRepo.save({
      ...generateUser(),
      isAdm: true,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
    userNotAdm = await userRepo.save({
      ...generateUser(),
      isAdm: false,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
    const courseRepo = connection.getRepository(Course);
    newCourse = await courseRepo.save({
      ...generateCourse(),
    });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  it("Return: User as JSON response | Status code: 200", async () => {
    const token = generateToken(userNotAdm.id);

    const response = await supertest(app)
      .patch(`/users/subscribe/${userNotAdm.id}`)
      .set("Authorization", "Bearer " + token)
      .send({ courseId: newCourse.id });

    const { password, ...user } = userNotAdm;

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ ...user, courses: [newCourse] })
    );
  });

  it("Return: Subscribe Another User as JSON response if requester is administrator | Status code: 200", async () => {
    const token = generateToken(userAdm.id);

    const response = await supertest(app)
      .patch(`/users/subscribe/${userNotAdm.id}`)
      .set("Authorization", "Bearer " + token)
      .send({ courseId: newCourse.id });

    const { password, ...user } = userNotAdm;

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ ...user, courses: [newCourse] })
    );
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const response = await supertest(app)
      .patch(`/users/subscribe/${userNotAdm.id}`)
      .send({ courseId: newCourse.id });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "Missing authorization token.",
    });
  });

  it("Return: Body error, no permision | Status code: 403", async () => {
    const token = generateToken(userNotAdm.id);

    const response = await supertest(app)
      .patch(`/users/subscribe/${userAdm.id}`)
      .set("Authorization", "Bearer " + token)
      .send({ courseId: newCourse.id });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "You can't access information of another user",
    });
  });
});
