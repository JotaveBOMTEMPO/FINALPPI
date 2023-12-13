import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';

const port = 3001;
const host = '0.0.0.0'
var user_list = [];
var msg_list = [];

function user_regist(req, res) {

    const data_u = req.body;
    let sys_resp = '';

    if (!(data_u.u_name && data_u.username && data_u.em && data_u.senha)) {

        sys_resp = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" type="text/css" href="cadastro.css">
            <title>Cadastro</title>
        </head>
        <body>
            <h1 class="titulo">CADASTRO</h1>
            <div id="box">
                <form action="/cadastro" method="POST" novalidate>
                    <label for="u_name" class="label">Nome:</label>
                    <input type="text" id="u_name" name="u_name" placeholder="Insira seu nome completo" required>
                    <br>
        `;
        if (!data_u.u_name) {
            sys_resp += `
                <text class="rockDanger">O campo "Nome" é obrigatório!</text>
                <br>
            `;
        }

        sys_resp += `
        <label for="username" class="label">Nome de Usuário:</label>
        <input type="text" id="username" name="username" placeholder="Insira seu nome de usuário" required>
        <br>
        `;
        if (!data_u.username) {
            sys_resp += `
                <text class="rockDanger">O campo "Nome de Usuário" é obrigatório!</text>
                <br>
            `;
        }

        sys_resp += `
        <label for="em" class="label">Email:</label>
        <input type="email" id="em" name="em" placeholder="Insira seu email" required>
        <br>
        `;
        if (!data_u.em) {
            sys_resp += `
                <text class="rockDanger">O campo "Email" é obrigatório!</text>
                <br>
            `;
        }

        sys_resp += `
        <label for="senha" class="label">Senha:</label>
        <input type="password" id="senha" name="senha" placeholder="Insira sua senha" required>
        <br>
        `;
        if (!data_u.senha) {
            sys_resp += `
                <text class="rockDanger">O campo "Senha" é obrigatório!</text>
                <br>
            `;
        }

        sys_resp += ` 
                <button id="BotconfirmCad" type="submit">Cadastrar</button>
                <p><a href="/login.html">Já tenho cadastro</a></p>
            </form>
         </div>
        </body>
        </html>
        `;

        res.end(sys_resp);
    }
    else {

        const USUARIO = {
            Name: data_u.u_name,
            userName: data_u.username,
            Email: data_u.em,
            Password: data_u.senha,
        }

        user_list.push(USUARIO);

        sys_resp = `
        <!DOCTYPE html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
            <title>Tabela de Cadastros</title>
        </head>
        <body>
            <h1>Usuários Cadastrados</h1>
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Nome Completo</th>
                        <th>Nome de Usuário</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
        `
        for (const USUARIO of user_list) {
            sys_resp += `
                <tr>
                    <td>${USUARIO.Name}</td>
                    <td>${USUARIO.userName}</td>
                    <td>${USUARIO.Email}</td>
                </tr>
            `;
        }

        sys_resp += `
                </tbody>
            </table>
            <a class="btn btn-primary" href="/" role="button">Voltar ao Menu</a>
            <a class="btn btn-outline-info" href="/cadastro.html" role="button">Acessar Cadastro</a>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>    
            </body>
            </html>
        `;
        res.end(sys_resp);

    }
}

function autentic(req, res, next) {
    if (req.session.usuAutenticar) {
        next();
    } else {
        res.redirect("/login.html");
    }
}

const app = express();

app.use(cookieParser());

app.use(session({ secret: "s3cr3tpsswrd", resave: true, saveUninitialized: true, cookie: { maxAge: 1000 * 60 * 15 } }));

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(), './paginas')));

app.get('/', autentic, (req, res) => {
    const dataUA = req.cookies.DataUltimoAcesso;
    const data = new Date();
    let sys_resp = '';

    res.cookie("DataUltimoAcesso", data.toLocaleString(), {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
    });

    sys_resp = `
    <!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="chat.css">
    <title>Chat</title>
</head>
<body>
    <h1 id="titulochat">CHAT</h1>
    <div id="ext-chat">
        <div id="int-chat">
    `;

    for (const mensagem of msg_list) {
        sys_resp += `
                <div class="name1">
                    ${mensagem.selectedUser}:
                </div>
                <div class="name1msg">
                    ${mensagem.msg} 
                </div>
                `;
    }

    sys_resp += `
                <div id="chat">
                    <form action="/mandarMSG" method="POST">
                        <select id="user_select" name="user_select">
    `;

    for (const USUARIO of user_list) {
        sys_resp += `
                            <option value="${USUARIO.userName}">${USUARIO.userName}</option>
        `;
    }

    sys_resp += `
    </select>
    <input id="msgArea" name="msgArea" type="text">
    <br>
    <p id="user_lastacs">Seu ultimo acesso foi em | ${dataUA} |</p>
    <button id="sendBttn">Enviar</button>
    <a href="cadastro.html"><button id="backMenu">Menu</button></a>
</form>
</div>
</div>
</div>
</body>
</html>                       
    `;

    res.end(sys_resp);

});

app.post('/login', (req, res) => {
    const usuario = req.body.userName_log;
    const senha = req.body.userPass_log;
    const usuarioCadastrado = user_list.find(user => user.userName === usuario && user.Password === senha);
    if (usuarioCadastrado) {
        req.session.usuAutenticar = true;
        res.redirect("/");
    } else {
        res.end(`
        <!DOCTYPE html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" type="text/css" href="cadastro.css">
            <title>erro</title>
        </head>
        <body>
            <h1 class="titulo">Nome de usuário e(ou) senha inválidos</h1>
            <a href="/login.html">Voltar ao Login</a>
            <a href="/cadastro.html">Cadastre-se</a>
        </body>
        </html>           
        `)
    }
});

app.get('/logout', (req, res) => {

    req.session.usuAutenticar = false;

    res.redirect('/login.html');
});

app.post('/cadastro', autentic, user_regist);

app.post('/mandarMSG', autentic, (req, res) => {
    const selectedUser = req.body.selUSU;
    const msg = req.body.msgArea;
    const horario = new Date().toLocaleString();

    msg_list.push({ selectedUser, msg, horario });

    res.redirect('/');
});

app.listen(port, host, () => {
    console.log(`Servidor operando na URL | http://${host}:${port} |`);
});
