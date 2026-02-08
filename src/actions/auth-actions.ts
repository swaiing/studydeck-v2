"use server"

import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function signup(formData: FormData) {
  try {
    // Validate input
    const rawData = {
      email: formData.get("email"),
      username: formData.get("username"),
      password: formData.get("password"),
    }

    const validatedData = signupSchema.parse(rawData)

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          { username: validatedData.username }
        ]
      }
    })

    if (existingUser) {
      if (existingUser.email === validatedData.email) {
        return { error: "Email already in use" }
      }
      return { error: "Username already taken" }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        username: validatedData.username,
        passwordHash,
      }
    })

    return { success: true, userId: user.id }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    console.error("Signup error:", error)
    return { error: "An error occurred during signup" }
  }
}
