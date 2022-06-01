import { Repository, UpdateResult } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entities";

interface IUserRepo {
    save: (user: Partial<User>) => Promise<User>;
    listAll: () => Promise<User[]>;
    retrieve: (payload: object) => Promise<User>;
    update: (id: string, payload: Partial<User>) => Promise<UpdateResult>;
}

class UserRepository implements IUserRepo {
    private userRepo: Repository<User>;

    constructor() {
        this.userRepo = AppDataSource.getRepository(User);
    }

    save = async (user:User): Promise<User> => await this.userRepo.save(user);
       
    listAll = async () => await this.userRepo.find(); 

    retrieve = async (payload: object) => await this.userRepo.findOneBy({...payload});

    update = async (id: string, payload: Partial<User>) => await this.userRepo.update(id, {...payload})
}

export default new UserRepository();
