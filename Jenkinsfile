pipeline {
	agent any
    tools {
            // Install the Maven version configured as "M3" and add it to the path.
            nodejs "NodeJSInstaller"
        }
  
    stages {
        stage("Git config"){
            steps {
                git branch: 'dev', url: 'https://github.com/ypappu926/angular.git'
            }
        }
        stage("Build Nodejs"){
            steps{
                sh "npm install"
                sh "ng build --base-href=/ --prod=true --build-optimizer=true --aot=true"
            }
        }
	    
    }
}
