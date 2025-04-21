pipeline {
  agent any

  environment {
    IMAGE_NAME = 'rain494/my_backend_image'
    DOCKERHUB_USERNAME = 'rain494' // Thay bằng DockerHub username của bạn nếu khác
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
        withCredentials([string(credentialsId: 'dockerhub-credentials', variable: 'DOCKERHUB_TOKEN')]) {
          sh '''
            echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
          '''
        }
      }
    }

    stage('Push Docker Image') {
      steps {
        script {
          docker.image("${IMAGE_NAME}:latest").push()
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
