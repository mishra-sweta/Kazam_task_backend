import { Schema, model, Document, Model } from "mongoose";

interface ITask extends Document {
  task: string;
}

const taskSchema = new Schema<ITask>({
  task: { type: String, required: true },
});

const Task: Model<ITask> = model<ITask>("assignment_sweta", taskSchema);

export default Task;
