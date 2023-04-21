import mongoose, { Document, Model, Schema } from 'mongoose'

export type ROLE = ['Admin' | 'User']

export interface UserType extends Document {
  username: string
  password: string
  roles: ROLE[]
  active: boolean
  refreshToken?: string
}

const useSchema: Schema<UserType> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    roles: [
      {
        type: String,
        default: ['User']
      }
    ],
    active: {
      type: Boolean,
      default: true
    },
    refreshToken: String
  },
  { timestamps: true }
)

const User: Model<UserType> = mongoose.model<UserType>('User', useSchema)
export default User
