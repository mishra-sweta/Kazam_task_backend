import { Schema, model } from "mongoose";
const taskSchema = new Schema({
    task: { type: String, required: true },
});
const Task = model("assignment_sweta", taskSchema);
export default Task;
