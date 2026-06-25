export const GLOSSARY = {
  appName: 'RoboSim',
  tagline: 'Robot Battle Simulator',
  
  // Login Page
  loginTitle: 'Access Cyber-Cockpit',
  loginSubtitle: 'Enter credentials to control your robots and join the arena.',
  usernameOrEmailLabel: 'Username or Email',
  usernameOrEmailPlaceholder: 'Enter username or email...',
  passwordLabel: 'Password',
  passwordPlaceholder: '••••••••',
  loginButtonText: 'Access Cockpit',
  loginButtonLoadingText: 'Verifying credentials...',
  noAccountText: "Don't have a commander profile?",
  registerLinkText: 'Create Profile',

  // Register Page
  registerTitle: 'Enlist Commander',
  registerSubtitle: 'Create a new commander profile to join the robotic war.',
  usernameLabel: 'Username',
  usernamePlaceholder: 'Alphanumeric, 3-30 chars',
  usernameValidationMsg: 'Username must be alphanumeric and between 3-30 characters.',
  emailLabel: 'Email Address',
  emailPlaceholder: 'commander@example.com',
  emailValidationMsg: 'Please enter a valid email address.',
  passwordStrengthWeak: 'Weak',
  passwordStrengthMedium: 'Medium',
  passwordStrengthStrong: 'Strong',
  passwordStrengthVeryStrong: 'Very Strong',
  confirmPasswordLabel: 'Confirm Password',
  confirmPasswordPlaceholder: '••••••••',
  confirmPasswordValidationMsg: 'Passwords do not match.',
  registerButtonText: 'Initialize Profile',
  registerButtonLoadingText: 'Enrolling crew...',
  hasAccountText: 'Already registered in the base?',
  loginLinkText: 'Access base',

  // Dashboard Page
  dashboardTitle: 'Command Cockpit',
  dashboardSubtitle: 'Welcome to RoboSim command center. Deploy scripts and coordinate battles.',
  welcomeCommander: 'Welcome, ',
  logoutBtn: 'Disconnect Session',
  profileCardTitle: '👤 Commander Profile',
  profileCardDesc: 'Verified identity credentials within the RoboSim network.',
  profileUsernameLabel: 'Username',
  profileEmailLabel: 'Email Address',
  profileJoinedLabel: 'Session Enrolled',
  profileIdLabel: 'Identity Signature',
  
  arenaCardTitle: '⚔️ Enter Battle Arena',
  arenaCardDesc: 'Deploy your robots in deterministic, tick-based 2D robotic warfare against other players.',
  arenaCardBtn: 'Launch Battle Grid',
  arenaFeatureAlert: 'Battle Grid is offline. Launch scheduled in next development phases.',
  
  robotsCardTitle: '🤖 Brain Laboratory',
  robotsCardDesc: 'Write, debug, and upload TypeScript scripts controlling your robot decision processors.',
  robotsCardBtn: 'Open Lab Editor',
  robotsFeatureAlert: 'Lab Editor is offline. Interface under construction.',
  
  historyCardTitle: '🎥 Match Archival Replays',
  historyCardDesc: 'Analyze historical battle logs step-by-step. Debug and optimize robot performance.',
  historyCardBtn: 'Query Archives',
  historyFeatureAlert: 'Replay query interface is offline. Archival system scheduled in next phases.'
};
export type Glossary = typeof GLOSSARY;
