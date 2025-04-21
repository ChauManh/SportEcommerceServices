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
        script {
          sh "docker build -t ${IMAGE_NAME}:latest ."
        }
      }
    }

    stage('Login to DockerHub') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
          }
        }
      }
    }

    stage('Push Docker Image') {
      steps {
        sh "docker push ${IMAGE_NAME}:latest"
      }
    }

    stage('Cleanup Local Image') {
      steps {
        sh "docker rmi ${IMAGE_NAME}:latest || true"
      }
    }
  }

  post {
    always {
      sh 'docker logout'
    }
    success {
      echo '✅ CI/CD backend thành công!'
    }
    failure {
      echo '❌ Có lỗi xảy ra trong pipeline!'
    }
  }
}
