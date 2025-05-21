import { Schema, model, Document } from "mongoose";

interface ITask extends Document {
  task: string;
}

const taskSchema = new Schema<ITask>({
  task: String,
});

export default model<ITask>("assignment_sweta", taskSchema);
