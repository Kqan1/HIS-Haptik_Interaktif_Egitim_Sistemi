from fastapi import FastAPI, Query
from langchain.document_loaders import PyPDFLoader
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
import os

loader = PyPDFLoader("data.pdf")
documents = loader.load_and_split()


embedding = OpenAIEmbeddings()

vectorstore = FAISS.from_documents(documents, embedding)
retriever = vectorstore.as_retriever()

llm = ChatOpenAI(model_name="gpt-4o", temperature=0)

qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

app = FastAPI()

@app.get("/sor")
async def sor(soru: str = Query(...)):
    cevap = qa_chain.run(soru)
    return {"soru": soru, "cevap": cevap}
