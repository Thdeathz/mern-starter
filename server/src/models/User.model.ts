import mongoose, { Document, Model, Schema } from 'mongoose'

import { ROLE } from '~/@types'

export interface UserType extends Document {
  email: string
  password: string
  roles: ROLE[]
  active: boolean
  refreshToken?: string
}

const useSchema: Schema<UserType> = new mongoose.Schema(
  {
    email: {
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
