import {GoogleGenerativeAI}  from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY  as string)



export async function  POST(request : Request) {
    
    try {
 
        const body = await request.json(); 
        const responsedtext = await run(body.prompt)  ; 
        return Response.json({data : responsedtext  , success : true})
    } catch (error) {
        console.log(error)
        return Response.json({success : false })
    
    }
}



async function run(prompt  : string) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text ; 
  }