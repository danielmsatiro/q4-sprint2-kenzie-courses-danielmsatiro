import supertest from "supertest";
import { DataSource } from "typeorm";
import { validate } from "uuid";
import { generateCourse, generateToken, generateUser } from "..";
import app from "../../app";
import AppDataSource from "../../data-source";
import { Course, User } from "../../entities";

describe("Create course route | Integration Test", () => {
  let connection: DataSource;
  let user: Partial<User> = generateUser();
  let course: Partial<Course> = generateCourse();

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

  it("Return: Course as JSON response | Status code: 201", async () => {
    const requester = await supertest(app)
      .post("/users")
      .send({ ...user, isAdm: true });

    const token = generateToken(requester.body.id);

    const response = await supertest(app)
      .post("/courses")
      .set("Authorization", "Bearer " + token)
      .send({ ...course });

    expect(response.status).toBe(201);
    expect(validate(response.body.id)).toBeTruthy();
    expect(response.body).toEqual(expect.objectContaining({ ...course }));
  });
});

/* describe("Get courses route | Integration Test", () => {
  let connection: DataSource;

  let course: Partial<Course> = generateCourse();
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

  it("Return: Courses as JSON response | Status code: 200", async () => {
    const adm = await supertest(app)
      .post("/users")
      .send({ ...user, isAdm: true });

    const tokenAdm = generateToken(adm.body.id);

    const newCourse = await supertest(app)
      .post("/courses")
      .set("Authorization", "Bearer " + tokenAdm)
      .send({ ...course });

    const response = await supertest(app)
      .get("/courses")
      .set("Authorization", "Bearer " + tokenAdm);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toEqual(expect.objectContaining({ ...newCourse }));
  });
}); */

describe("Update Course route | Integration Test", () => {
  let connection: DataSource;

  let course: Partial<Course> = generateCourse();
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

  it("Return: Course as JSON response | Status code: 200", async () => {
    const requester = await supertest(app)
      .post("/users")
      .send({ ...user, isAdm: true });

    const token = generateToken(requester.body.id);

    const newCourse = await supertest(app)
      .post("/courses")
      .set("Authorization", "Bearer " + token)
      .send({ ...course });

    const newInformation = generateCourse();

    const response = await supertest(app)
      .patch(`/courses/${newCourse.body.id}`)
      .set("Authorization", "Bearer " + token)
      .send({ ...newInformation });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ ...newInformation })
    );
  });

  it("Return: Body error, missing token | Status code: 400", async () => {
    const requester = await supertest(app)
      .post("/users")
      .send({ ...user, isAdm: true });

    const token = generateToken(requester.body.id);

    const newCourse = await supertest(app)
      .post("/courses")
      .set("Authorization", "Bearer " + token)
      .send({ ...course });

    const newInformation = generateCourse();

    const response = await supertest(app)
      .patch(`/courses/${newCourse.body.id}`)
      .send({ ...newInformation });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: "Missing authorization token.",
    });
  });
});
