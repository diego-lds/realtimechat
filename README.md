Projeto de troca de mensagens para sala de bate-papo em tempo real utilizando React.js e Tailwind.css para o **frontend**. Para o **backend** foi utilizada a estrutura do Firebase.

Tecnologias Utilizadas

**React +  Tailwind + Firebase**

## Versão de produção (hospedado na vercel)

---

https://realtimechat-one.vercel.app/

## Rodando o projeto localmente

---

Crie um arquivo .env e substitua pela config do seu projeto firestore

```jsx
export const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};
```

Na pasta root do projeto;

`npm install` 

`npm run start`