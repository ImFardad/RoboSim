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
  profileCardTitle: 'Commander Profile',
  profileCardDesc: 'Verified identity credentials within the RoboSim network.',
  profileUsernameLabel: 'Username',
  profileEmailLabel: 'Email Address',
  profileJoinedLabel: 'Session Enrolled',
  profileIdLabel: 'Identity Signature',
  
  arenaCardTitle: 'Enter Battle Arena',
  arenaCardDesc: 'Deploy your robots in deterministic, tick-based 2D robotic warfare against other players.',
  arenaCardBtn: 'Launch Battle Grid',
  arenaFeatureAlert: 'Battle Grid is offline. Launch scheduled in next development phases.',
  
  robotsCardTitle: 'Brain Laboratory',
  robotsCardDesc: 'Write, debug, and upload TypeScript scripts controlling your robot decision processors.',
  robotsCardBtn: 'Open Lab Editor',
  robotsFeatureAlert: 'Lab Editor is offline. Interface under construction.',
  
  historyCardTitle: 'Match Archival Replays',
  historyCardDesc: 'Analyze historical battle logs step-by-step. Debug and optimize robot performance.',
  historyCardBtn: 'Query Archives',
  historyFeatureAlert: 'Replay query interface is offline. Archival system scheduled in next phases.',

  // Robot Laboratory
  labTitle: 'Robot Assembly Laboratory',
  labSubtitle: 'Modify, calibrate, and upgrade your default physical robot parts and monitor real-time specifications.',
  backToDashboardBtn: 'Back to Cockpit',
  saveConfigBtn: 'Lock Configuration',
  savingConfigText: 'Syncing core systems...',
  saveSuccessToast: 'Robot configuration synchronized successfully.',
  saveErrorToast: 'Failed to update robot configuration.',
  loadErrorToast: 'Failed to load robot configuration.',
  
  // Component section titles
  bodyUpgradeTitle: 'Chassis Plating (Body)',
  bodyUpgradeDesc: 'Increases structural HP by +20% but adds +10% weight.',
  batteryUpgradeTitle: 'Power Core (Battery)',
  batteryUpgradeDesc: 'Expands energy storage capacity by +25% and adds +15% weight.',
  brainUpgradeTitle: 'Processor Core (Brain)',
  brainUpgradeDesc: 'Increases multitasking capacity to run more scripts concurrently (+1 task per level).',
  engineUpgradeTitle: 'Engine Power (Rear Wheels)',
  engineUpgradeDesc: 'Boosts propulsion thrust by +5% but increases consumption rate by +5%.',
  steeringUpgradeTitle: 'Steering Servos (Front Wheels)',
  steeringUpgradeDesc: 'Calibrates front-wheel deflection range (120° to 160°) and angular transition speed.',
  sensorsInfoTitle: 'Orthogonal Distance Sensors',
  sensorsInfoDesc: 'Equipped with 4 default orthogonal scanners (Front, Back, Left, Right). Constant 3 kg weight. Non-upgradable.',
  
  // Real-time specs panel
  specsHeader: 'Chassis Specifications',
  hpStat: 'Structural Durability',
  weightStat: 'Total Vehicle Mass',
  enginePowerStat: 'Engine Thrust',
  accelStat: 'Propulsion Accel',
  speedStat: 'Top Speed Bounds',
  tasksStat: 'Processor Threads',
  steerRangeStat: 'Steering Amplitude',
  steerSpeedStat: 'Steering Velocity',
  batteryCapStat: 'Energy Capacity',
  idleTimeStat: 'Maximum Idle Time',
  moveTimeStat: 'Full-Throttle Duration',

  // Steering simulator
  simulatorTitle: 'Steering Deflection Simulator',
  simulatorDesc: 'Use the slider to simulate steering command changes. Notice the wheel rotation response latency determined by your current Steering Servos level.',
  steerAngleLabel: 'Command Angle Target: ',
  currentAngleLabel: 'Current Wheel Angle: ',

  // Motion simulator
  motionSimulatorTitle: 'Propulsion & Motion Simulator',
  motionSimulatorDesc: 'Modulate motor throttle to simulate forward and reverse acceleration. Watch the tyre tread patterns scroll and monitor velocity adjustments in real-time.',
  throttleLabel: 'Command Throttle Target: ',
  simSpeedLabel: 'Simulated Speed: ',
  simAccelLabel: 'Active Acceleration: '
};
export type Glossary = typeof GLOSSARY;
