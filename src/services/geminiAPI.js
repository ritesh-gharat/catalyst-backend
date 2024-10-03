import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

import chatPrompts from "../utils/responseInstruct.js";
import convertHistory from "../utils/historyModifer.js";
import getFileData from "../utils/getFileData.js";

async function generateResponse(requestSession) {
  const sessionType =
    requestSession.sessionType === "computer-science"
      ? "computerScience"
      : requestSession.sessionType; // Get the session type
  const prompt = requestSession.prompt; // Get the prompt
  const imageOrigin = requestSession.imageOrigin; // Get the image origin

  const imageData = getFileData(imageOrigin); // Get the image type and data

  requestSession.history = convertHistory(requestSession.history); // Convert the history to required format

  const sessionChatsHistory = requestSession.history
    ? chatPrompts[sessionType].turningHistory.concat(requestSession.history)
    : chatPrompts[sessionType].turningHistory; // the chat history

  // Create a new instance of the GoogleGenerativeAI class
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // Get the generative model
  const model = genAI.getGenerativeModel({
    model: chatPrompts[sessionType].model,
    systemInstruction: chatPrompts[sessionType].systemInstruction,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ],
  });

  // Start a new chat session
  const chatSession = model.startChat({
    history: sessionChatsHistory,
    generationConfig: chatPrompts[sessionType].generationConfig,
  });

  // Send the prompt and image data to the chat session
  const result = await chatSession.sendMessageStream(
    imageData ? [prompt, imageData] : [prompt]
  );

  // Return the result
  return result;
}

export { generateResponse };