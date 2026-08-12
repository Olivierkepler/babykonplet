import Credentials from "next-auth/providers/credentials";

const authConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {},
      async authorize() {
        return null; // middleware only needs structure
      },
    }),
  ],
};

export default authConfig;