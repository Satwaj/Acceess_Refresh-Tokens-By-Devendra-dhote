import { mongoose } from "mongoose"
import bcrypt from "bcryptjs";


let userSchema = mongoose.Schema(
  {
    name: {
      type: String
    },
    email: {
      type: String,
      required: [true, "Email is required"]
    },
    password: {
      type: String,
      select: false,
      required: [true, "Password is required"]
    },
    refreshToken: {
      type: String
    }

  },

  {
    timestamps:true
  }
)

userSchema.pre("save", async function () {

  if (!this.isModified("password")) return

  const hash = await bcrypt.hash(this.password, 10)

  this.password = hash;
})

userSchema.methods.comparePassword = async function (password) {

  return await bcrypt.compare(password, this.password)
}

let userModel = mongoose.model("Users",userSchema)


export default userModel
