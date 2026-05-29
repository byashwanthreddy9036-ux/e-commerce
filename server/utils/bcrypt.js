import bcrypt from 'bcryptjs'

const saltRounds = Number(process.env.SALT_ROUNDS) || 10

export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.error("hashPassword error:", error);
        throw error;
    }
};

export const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.error("comparePassword error:", error);
        throw error; 
    }
};

