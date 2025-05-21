import { Schema, model } from "mongoose";

const taskSchema = new Schema({
  task: String,
});

export default model("assignment_sweta", taskSchema);
