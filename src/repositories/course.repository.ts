import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "../data-source";
import { Course } from "../entities";

interface ICourseRepo {
    save: (course: Partial<Course>) => Promise<Course>;
    listAll: () => Promise<Course[]>;
    retrieve: (payload: object) => Promise<Course>
    update: (id: string, payload: Partial<Course>) => Promise<UpdateResult>;
    delete: (id: string) => Promise<DeleteResult>;
}

class CourseRepository implements ICourseRepo {
    private courseRepo: Repository<Course>;

    constructor() {
        this.courseRepo = AppDataSource.getRepository(Course);
    }

    save = async (course:Course): Promise<Course> => await this.courseRepo.save(course);
       
    listAll = async () => await this.courseRepo.find(); 

    retrieve = async (payload: object) => await this.courseRepo.findOneBy({...payload})

    update = async (id: string, payload: Partial<Course>): Promise<UpdateResult> => await this.courseRepo.update(id, {...payload})

    delete = async (id: string): Promise<DeleteResult> => await this.courseRepo.delete(id);
}

export default new CourseRepository();