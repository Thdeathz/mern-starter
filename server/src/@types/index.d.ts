export declare interface UserData {
  id?: Types.ObjectId
  email: string
  password?: string
  roles?: ROLE[]
  active?: boolean
}

export declare type ROLE = ['Admin' | 'User']
