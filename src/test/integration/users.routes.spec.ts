import { Connection, generateUser } from "..";
import { User } from "../../entities";
import request from "supertest";
import app from "../../app";
import { validate } from "uuid";

describe("Create user route | Integration Test", () => {
  const dbConnection = new Connection();

  beforeAll(async () => {
    await dbConnection.create();
  });

  afterAll(async () => {
    await dbConnection.clear();
    await dbConnection.close();
  });

  it("Return: User as JSON response | Status code: 201", async () => {
    const user: Partial<User> = generateUser();

    console.log(user);

    const response = await request(app)
      .post("/users")
      .send({ ...user });

    expect(response.status).toBe(201);
    expect(validate(response.body.userUuid)).toBeTruthy();
    expect(response.body).toEqual(expect.objectContaining({ ...user }));
  });

  /* it("Return: Body error, missing password | Status code: 400", async () => {
    const { password, ...user } = generateUser();
    const response = await request(app)
      .post("/register")
      .send({ ...user });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toStrictEqual({
      message: ["password is a required field"],
    });
  }); */
});
