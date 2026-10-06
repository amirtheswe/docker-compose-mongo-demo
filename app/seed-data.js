// Starting data for the portfolio. server.js inserts each list only when its
// collection is empty, so edits made later in mongo-express are kept.
module.exports = {
  profile: [{
    name: 'Amir Ismail',
    headline: 'DevOps engineer in training, heading toward DevSecOps.',
    summary: [
      'I studied computer science (information systems) and began by building Flutter apps. After that I worked as a system and network administrator, which is the hands-on base for my move into DevOps.',
      'Now I turn that into automation: Bash scripts, Docker images and Compose files, all in public repositories. I am looking for a DevOps engineer role.'
    ],
    links: [
      { label: 'GitHub: amirtheswe', url: 'https://github.com/amirtheswe' },
      { label: 'Docker Hub: amirtheswe', url: 'https://hub.docker.com/u/amirtheswe' }
    ]
  }],
  experience: [
    { order: 1, period: 'Feb 2025 - Mar 2026', role: 'System & Network Administrator', place: 'Cairo, Egypt', note: 'Administered systems and networks day to day.' },
    { order: 2, period: 'Jun - Aug 2023', role: 'Software Engineering Intern', place: 'Instant Software Solution', note: 'Built Flutter mobile apps with Bloc state management.' },
    { order: 3, period: '2020 - 2024', role: 'BSc Computer Science (Information Systems)', place: 'October 6 University, Egypt', note: '' }
  ],
  projects: [
    { order: 1, name: 'devops_scripts', url: 'https://github.com/amirtheswe/devops_scripts', tags: ['Bash', 'Linux', 'rsync', 'cron'],
      summary: 'Three parameterized Bash scripts: backups over rsync and SSH with logging, log rotation with compression and cleanup, and CPU, memory and disk monitoring. Scheduled with cron.' },
    { order: 2, name: 'devops-backup-tool', url: 'https://hub.docker.com/r/amirtheswe/devops-backup-tool', tags: ['Docker', 'Docker Hub'],
      summary: 'The backup script packaged as a Docker image: Dockerfile, build, tag and push to Docker Hub.' },
    { order: 3, name: 'docker-compose-mongo-demo', url: 'https://github.com/amirtheswe/docker-compose-mongo-demo', tags: ['Docker Compose', 'Node.js', 'MongoDB'],
      summary: 'This portfolio. A Node app, MongoDB and mongo-express started by one Compose file, with data in a volume and credentials in an ignored .env file.' },
    { order: 4, name: 'Docker practice host on AWS', tags: ['AWS', 'EC2', 'Docker'],
      summary: 'An Ubuntu EC2 instance (t3.micro) that I use as a Docker practice host.' }
  ],
  skills: [
    { order: 1, group: 'Linux and scripting', status: 'working', items: ['Bash', 'cron', 'rsync', 'SSH'] },
    { order: 2, group: 'Git and GitHub', status: 'working', items: ['Branching', 'Merge conflicts', 'Reset and revert', 'Stash'] },
    { order: 3, group: 'Containers', status: 'working', items: ['Docker', 'Dockerfiles', 'Docker Hub', 'Docker Compose'] },
    { order: 4, group: 'Cloud', status: 'learning', items: ['AWS EC2', 'VPC', 'S3', 'EFS', 'AMI'] },
    { order: 5, group: 'Mobile', status: 'working', items: ['Flutter', 'Dart', 'Bloc'] },
    { order: 6, group: 'Next on my list', status: 'next', items: ['Terraform', 'Kubernetes', 'CI/CD pipelines', 'DevSecOps'] }
  ]
};
