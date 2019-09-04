import {AuthChecker} from "type-graphql";
import {ApiContext} from "../types/ApiContext";
import {ForbiddenError} from "apollo-server-errors";
import {User} from "../entity/User";

export const Roles: AuthChecker<ApiContext> = async ({ context  }, roles): Promise<any> => {

  if(context.req.session!.user) {
    const isAccess = (context.req.session!.user as User).userGroup.permissions.access.includes(roles[0]);
    const isModify = (context.req.session!.user as User).userGroup.permissions.modify.includes(roles[0]);

    if ( isAccess || isModify ) {
      return true
    }
  }

  throw new ForbiddenError("You don't have Authorization")
};
