pipeline {
  agent any

  environment {
    IMAGE_NAME = 'rain494/my_backend_image'
    DOCKERHUB_USERNAME = 'rain494' 
    BACKEND_EC2_IP = '52.77.225.127'
    BACKEND_DIR = '/home/ubuntu/doan1'
  }

  stages {
    stage('Clone Source') {
      steps {
        git branch: 'master', url: 'https://github.com/ChauManh/SportEcommerceServices.git'
      }
    }

    stage('Cleanup Before Build') {
      steps {
        sh "docker system prune -af || true"
      }
    }
    
    stage('Build Docker Image') {
      steps {
        sh "docker build -t ${IMAGE_NAME}:latest ."
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

    stage('Cleanup Local Images') {
      steps {
        sh "docker rmi ${IMAGE_NAME}:latest || true"
        sh "docker image prune -f"
      }
    }

    stage('Deploy to Backend EC2') { 
      steps { 
        script { 
          sshagent(['ec2-ssh-backend']) { 
            sh "ssh -o StrictHostKeyChecking=no ubuntu@${BACKEND_EC2_IP} 'cd ${BACKEND_DIR} && docker-compose pull && docker-compose down && docker-compose up -d'"
          } 
        } 
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