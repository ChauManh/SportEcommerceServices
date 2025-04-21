pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') // ID trong Jenkins
    IMAGE_NAME = 'rain494/my_backend_image'
  }

  stages {
    stage('Clone Source') {
      steps {
        git branch: 'master', url: 'https://github.com/ChauManh/SportEcommerceServices.git'
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          docker.build("${IMAGE_NAME}:latest")
        }
      }
    }

    stage('Login to DockerHub') {
      steps {
        script {
          docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
            echo "Logged in to DockerHub"
          }
        }
      }
    }

    stage('Push Docker Image') {
      steps {
        script {
          docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
            docker.image("${IMAGE_NAME}:latest").push()
          }
        }
      }
    }
  }

  post {
    success {
      echo '🚀 CI/CD backend thành công!'
    }
    failure {
      echo '❌ Có lỗi xảy ra!'
    }
  }
}
