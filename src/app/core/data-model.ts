export class LoginUser {
  constructor(
    public loginID: string,
    public password: string,
    public rememberLogin: boolean,
  ) { }
}

export class RegUser {
  constructor(
    public loginID: string,
    public password: string,
    public password2: string,
  ) { }
}

export class Profile {
  constructor(
    public DgnOperatorType: string,
    public Name: string,
    public UserID?: string,
    public ID?: number,
    public Code?: string,
    public Email?: string,
    public Mobile?: string,
    public CompID?: string,
    public Remark?: string,
    public UserImages?:string,
  ) { }
}

export class RouteApi {
  constructor(
    public DgnOperatorType: string,
    public ApiID: number,
    public RouteName: string,
    public ApiExecSql: string,
    public IsCancel: number,
    public IsOpen: number,
    public ApiType:string,
    public AutoGenerateSqlType: string,
    public RouteID?: number,
    public AutoGenerateSqlTableName?: string,
    public ApiExecConditionSql?: string,
    public PMenuID?: number,
    public IsAllowRoleRight?:number,
    public ID?: number,

  ) { }
}

export class ChangePassword {
  constructor(
//    public userID: string,
    public oldpassword: string,
    public newpassword: string,
    public newpassword2: string,
  ) { }
}