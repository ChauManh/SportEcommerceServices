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
            try {
                docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                echo "✅ Logged in to DockerHub"
                }
            } catch (err) {
                echo "❌ Failed to login to DockerHub: ${err.getMessage()}"
                error("Stopping pipeline due to login failure.")
            }
            }
        }
    }

    stage('Push Docker Image') {
        steps {
            script {
            try {
                docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                docker.image("${IMAGE_NAME}:latest").push()
                echo "✅ Successfully pushed Docker image: ${IMAGE_NAME}:latest"
                }
            } catch (err) {
                echo "❌ Failed to push Docker image: ${err.getMessage()}"
                error("Stopping pipeline due to push failure.")
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
