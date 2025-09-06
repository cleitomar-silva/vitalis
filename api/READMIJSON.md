meu-projeto/
│
├─ api/                 # Código do backend
│  ├─ config/
│  │   └─ db.js         # Configuração da conexão MySQL
│  ├─ controllers/
│  │   └─ userController.js
│  ├─ models/
│  │   └─ userModel.js
│  ├─ routes/
│  │   └─ userRoutes.js
│  ├─ middlewares/
│  │   └─ authMiddleware.js  # opcional, se quiser autenticação
│  ├─ index.js           # ponto de entrada do servidor
│  └─ package.json
└─ .gitignore