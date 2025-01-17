import { chain } from "./middlewares/chain";
import { withAuthMiddleware } from "./middlewares/withAuthMiddleware";
import { withPathnameMiddleware } from "./middlewares/withPathnameMiddleware";
// import { createTeamMiddleware } from "./middlewares/createTeamMiddleware";
// import { testingMiddleware } from "./middlewares/testingMiddleware";

export default chain([withAuthMiddleware , withPathnameMiddleware])
// export default chain([withAuthMiddleware , withPathnameMiddleware , createTeamMiddleware , testingMiddleware])
export const config = {
  matcher: "/dashboard(.*)",
};
