
<template >
  <div id="main" class="main-container">
    <h1 class="">INICIAR SESIÓN</h1>
    <div class=" bg-info">
      <form action="registro">
        <!--<no-ssr>-->
        <table style="width:50%;">
          <tbody>
            <tr>
              <td>
                <label for="email">e-mail:</label>
              </td>
              <td>
                <input type="email" v-model="usuarioLogin.email" placeholder="Escribe tu email">
              </td>
            </tr>
            <tr>
              <td>
                <label for="contrasenia">Contraseña:</label>
              </td>
              <td>
                <input type="password" suggested="current-password" v-model="usuarioLogin.password" placeholder="Escribe tu contraseña">
              </td>
            </tr>
            <tr>
              <td>
                <b-btn class="bg-success" v-on:click="login">ABRIR SESIÓN</b-btn>
              </td>
              <td>
                <b-btn class="bg-success" v-on:click="loginAdmin">ABRIR SESIÓN DE PRUEBA</b-btn>
              </td>
            </tr>
          </tbody>
        </table>
        <!--</no-ssr>-->
      </form>
    </div>
    <div>
      <br />
      <h5 v-model="usuarioLogin">Usuario: {{usuarioLogin.email}}({{usuarioLogin.nombres+' '+usuarioLogin.paterno+' '+(usuarioLogin.materno||'')}}): {{usuarioLogin.rol}}</h5>
      <h5 v-model="token">  Token: {{token}}</h5>
      <br />
      <h5 class="text-warning bg-info">{{err}}</h5>
    </div>
    <div class="text-right">
      <b-btn class="right" variant="danger" v-on:click="logout">CERRAR SESIÓN</b-btn>
    </div>
      

  </div>
</template>

<script>
  
  import axios from 'axios';
  var urlLogin = process.env.urlServer + '/login';
  const usuarioVacio = { email: '', password: '' };
  export default {
    name:'loginCmp',
    data() {
      return {
        usuarioLogin: usuarioVacio,
        token: '',
        err: ''
      }
    }
  ,
    computed: {
      Token: {
        get: () => {
          return this.$store.getters.getToken;
        },
        set: (payload) => {
          this.$store.commit('setToken', payload);
        }
      },
      Host: {
        get: () => {
          return this.$store.getters.getHost;
        }
      }
    },
    created() {
    },
    methods: {
      loginAdmin() {

        this.usuarioLogin = { email: '', password: '' }
        this.usuarioLogin.email = "gabox@msn.com";
        this.usuarioLogin.password = "12345";
        this.login();
      },

      login() {
        if (this.usuarioLogin.email === '' || this.usuarioLogin.password === '') {
          this.$store.commit('setToken', 'NONE');
          this.token = 'NONE';
          return;
        }

        axios.post(urlLogin, {
          email: this.usuarioLogin.email,
          password: this.usuarioLogin.password
        })
          .then((response) => {
            this.token = response.data.token;
            this.$store.commit('setToken', this.token);
            this.usuarioLogin = response.data.usuario;
            this.$store.commit('setUsuarioId', this.usuarioLogin._id);
            this.$store.commit('setUsuario', this.usuarioLogin);
            if (this.usuarioLogin.rol==='ADMIN_ROL') {
              this.$router.push('UsuariosPage');
            }
            else {
              this.$router.push('RegistroPaciente');
            }
          },
          (error) => {
            this.err = error.response.data.error;
            this.$store.commit('setToken', 'NONE');
            this.$store.commit('setPacienteId', 'NONE');
            this.$store.commit('setUsuarioId', 'NONE');
            this.$store.commit('setUsuario', {});
            this.token = 'NONE';
            this.usuarioLogin = usuarioVacio;
          });
      },
      logout() {
        this.$store.commit('setToken', 'NONE');
        this.$store.commit('setPacienteId', 'NONE');
        this.$store.commit('setUsuarioId', 'NONE');
        this.$store.commit('setRol', 'NONE');
        this.token = 'NONE';
        this.usuarioLogin = usuarioVacio;
        alert('Sesión cerrrada!');
      }
    }
  };
</script>

