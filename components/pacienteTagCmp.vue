<template>
  <!--<div class="contanier fixed-top margin-bottom:10px">-->
  <div ref="barraMensajes">
    <!--<p>id: -{{getPacienteId}}</p>-->
    <h5 class="bg-warning ">EXPEDIENTE: {{paciente?paciente.nombre:'N I N G U N O'}} <!----- {{paciente?paciente.diagnosticoIngreso:''}}--></h5>
  </div>
  <!--</div>-->
</template>
<script>
  import axios from 'axios';
  export default
    {
      name: 'pacienteTagCmp',
      ////////////////////////
      data() {
        return {
          paciente: { nombre: '' },
          token: 'NONE'
        }
      },
      // props: [
      //   'paciente'
      //],
      computed: {
        urlGetPaciente: function () {
          //console.log('url--->', this.$store.state.host + '/paciente/' + this.$store.state.pacienteId);
          //return this.$store.state.host + '/paciente/' + this.$store.state.pacienteId;
          return process.env.urlServer +'/paciente/'+ this.$store.state.pacienteId;
          //return 'http://localhost:3000/paciente/' + this.$store.state.pacienteId;
        },
        getPacienteId: function () {
          return this.$store.state.pacienteId;
        },
        getSocketDatosGenerales: function () {
          return this.$store.state.socketDatosGenerales;
        },
        getToken: function () {
          //console.log('1 getPaciente-->token: ', this.$store.state.token);
          return this.$store.state.token;
        },
        //getSocketNotify: function() {
        //  return this.$store.state.socketNotify;
        //}
      }, 
      watch: {
        getPacienteId: function () {
          this.getPaciente();
        },
        getSocketDatosGenerales: function () {
          this.getPaciente();
        },
        //getSocketNotify: function() {
        //  showNotify()
        //}
      },
      created() {

        //console.log('Aquí en creado pacienteTAGCmp: ', this.urlGetPaciente)
        if (this.getPacienteId === '') {

        };
        this.getPaciente();
      },
      methods: {

        getPaciente() {

          //console.log('2 getPaciente-->token: ', this.$store.state.token);
          //console.log('3 pacienteTagCmp-->getPaciente: ');
          this.token = this.getToken;
          //console.log('4 getPaciente-->token: ', this.token);
          axios.get(this.urlGetPaciente, {
            token: this.token
          })
            .then((response) => {
              //console.log('5 getPaciente-->lEÍ PACIENTE OK: ', response.data.paciente);
              this.paciente = response.data.paciente;
              //this.$store.commit('setCurrentPaciente', response.data.paciente);

            },
              (error) => {
                this.paciente = { nombre: '--N I N G U N O--' };
                //this.$store.commit('setCurrentPaciente', this.paciente);
                //console.log('hubo error: en pacienteTag : ',error);
                this.err = error.response.data.error;
              });
          //console.log('al final en pacienteTag= ', this.paciente);
        }
      }
    }


</script>

<!--<style scoped>
  html {
    font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
  }

  .button--green {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #3b8070;
    color: #3b8070;
    text-decoration: none;
    padding: 10px 30px;
  }

    .button--green:hover {
      color: #fff;
      background-color: #3b8070;
    }

  .button--grey {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #35495e;
    color: #35495e;
    text-decoration: none;
    padding: 10px 30px;
    margin-left: 15px;
  }

    .button--grey:hover {
      color: #fff;
      background-color: #35495e;
    }
</style>-->
