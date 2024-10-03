import mongoose from "mongoose";
import Session from "../models/session.model.js";

const { ObjectId } = mongoose.Types;

const createChatForSession = async (session, file, response) => {
  try {
    const newSession = new Session({
      userId: session.id.split("-")[0],
      sessionType: session.sessionType,
      messages: [
        {
          role: "user",
          text: session.prompt, // Ensure this is a string
          image: {
            origin: file.origin,
            type: file.type,
          },
        },
        {
          role: "model",
          text: response, // Ensure this is a string
        },
      ],
    });

    await newSession.save();
    //console.log("New session created:", newSession);
    return newSession;
  } catch (error) {
    console.error("Error creating chat for session:", error);
    throw error;
  }
};

const updateMessagesForSession = async (sessionId, session, file, response) => {
  try {
    const sessionToUpdate = await Session.findById(new ObjectId(sessionId)); // FIXED
    if (!sessionToUpdate) {
      createChatForSession(session, file, response);
      throw new Error("Session not found");
    }

    sessionToUpdate.messages.push(
      {
        role: "user",
        text: session.prompt, // Ensure this is a string
        image: {
          origin: file.origin,
          type: file.type,
        },
      },
      {
        role: "model",
        text: response, // Ensure this is a string
      }
    );

    await sessionToUpdate.save();
    //console.log("Session updated:", sessionToUpdate);
    return sessionToUpdate;
  } catch (error) {
    console.error("Error updating messages for session:", error);
    throw error;
  }
};

export { createChatForSession, updateMessagesForSession };
