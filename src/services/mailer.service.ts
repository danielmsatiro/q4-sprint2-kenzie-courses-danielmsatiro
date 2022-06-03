import { Request } from "express";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import transport from "../config/mailer.config";
import { Course, User } from "../entities";
import { ErrorHandler } from "../errors/errors";

class mailerService {
  subscribeCourseEmail = (user: User, course: Course) => {
    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.resolve("./src/views/"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./src/views/"),
    };

    transport.use("compile", hbs(handlebarOptions as any));

    const mailOptions = {
      from: "mateus_satiro@yahoo.com.br",
      to: user.email,
      subject: "Incrição realizada com sucesso!",
      template: "email",
      context: {
        name: user.firstName,
        courseName: course.courseName,
        duration: course.duration,
      },
    };

    transport.sendMail(mailOptions, (err) => {
      if (err) {
        throw new ErrorHandler(424, "Email could not be sent");
      }
    });
  };
}

export default new mailerService();
