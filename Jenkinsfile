pipeline {
  agent any

  environment {
    DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
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
        sh "docker build -t ${IMAGE_NAME}:latest ."
      }
    }

    stage('Login to DockerHub') {
      steps {
        sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"
      }
    }

    stage('Push Docker Image') {
      steps {
        sh "docker push ${IMAGE_NAME}:latest"
      }
    }
  }

  post {
    always {
      sh "docker logout"
    }
    success {
      echo '🚀 CI/CD backend thành công!'
    }
    failure {
      echo '❌ Có lỗi xảy ra!'
    }
  }
}