import { isValidObjectId } from "mongoose";

/** 404s early when :id isn't a valid ObjectId (avoids CastErrors deeper down). */
export default function checkObjectId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error(`Invalid id: ${req.params.id}`);
  }
  next();
}
