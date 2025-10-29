import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dates: [
      {
        type: Date,
        required: true,
      },
    ],
    slots: [
      {
        type: String,
        required: true,
      },
    ],
    slotAvailability: [
      {
        date: {
          type: Date,
          required: true,
        },
        timeSlots: [
          {
            slot: {
              type: String,
              required: true,
            },
            totalSlots: {
              type: Number,
              required: true,
              min: 0,
            },
            availableSlots: {
              type: Number,
              required: true,
              min: 0,
            },
          },
        ],
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Experience = mongoose.model("Experience", experienceSchema);
