import { UserRepository } from "../../DB/Repositories";
import { userModel } from "../../DB/Models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserResolver {
  private userRepo: UserRepository = new UserRepository(userModel);

  sayHello = (__: any, args: any) => ({ ...args, id: 8 });

  listUser = async () => {
    return await this.userRepo.findDocuments({});
  };

  signUp = async (__: any, args: any) => {
    const { firstName, lastName, email, password } = args;

    const existingUser = await this.userRepo.findOneDocument({ email });
    if (existingUser) {
      throw new Error("Email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userRepo.createNewDocument({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return newUser;
  };

  login = async (__: any, args: any) => {
    const { email, password } = args;

    const user = await this.userRepo.findOneDocument({ email });
    if (!user) throw new Error("Invalid email or password.");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid email or password.");

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "1d" }
    );

    return { token, user };
  };
}

export default UserResolver;
