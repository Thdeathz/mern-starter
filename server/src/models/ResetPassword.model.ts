import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ResetPasswordType extends Document {
  email: string
  token: string
  expries: Date
  verified: boolean
  isActive: boolean
}

const resetPasswordSchema: Schema<ResetPasswordType> = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    },
    expries: {
      type: Date,
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

const ResetPassword: Model<ResetPasswordType> = mongoose.model<ResetPasswordType>(
  'ResetPassword',
  resetPasswordSchema
)
export default ResetPassword
