pipeline {
    agent any


    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/mobile-data-indonesia-mdi/InvoSync.git', branch: 'dev'
            }
        }

        stage('Trigger Test') {
            steps {
                echo "✅ Jenkins Pipeline Triggered Successfully!"
            }
        }

        stage('Print Dockerfile') {
            steps {
                echo 'Isi Dockerfile:'
                sh 'cat Dockerfile'
            }
        }
    }
}

