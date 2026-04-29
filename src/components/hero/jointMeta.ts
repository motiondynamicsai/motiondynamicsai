// Joint metadata — pretty names, click-to-headline overrides,
// and adjacency for joint-angle computation.

export const JOINT_NAMES = [
  'hip_c', 'chest', 'neck', 'head',
  'l_sh', 'l_el', 'l_wr',
  'r_sh', 'r_el', 'r_wr',
  'l_hip', 'l_kn', 'l_an',
  'r_hip', 'r_kn', 'r_an',
] as const;

export type JointName = typeof JOINT_NAMES[number];

export const CONNECTIONS: ReadonlyArray<readonly [JointName, JointName]> = [
  ['hip_c', 'chest'], ['chest', 'neck'], ['neck', 'head'],
  ['chest', 'l_sh'], ['l_sh', 'l_el'], ['l_el', 'l_wr'],
  ['chest', 'r_sh'], ['r_sh', 'r_el'], ['r_el', 'r_wr'],
  ['hip_c', 'l_hip'], ['l_hip', 'l_kn'], ['l_kn', 'l_an'],
  ['hip_c', 'r_hip'], ['r_hip', 'r_kn'], ['r_kn', 'r_an'],
];

export const JOINT_PRETTY_NAME: Record<JointName, string> = {
  hip_c: 'Pelvis',
  chest: 'Chest',
  neck: 'Neck',
  head: 'Head',
  l_sh: 'Left shoulder',
  l_el: 'Left elbow',
  l_wr: 'Left wrist',
  r_sh: 'Right shoulder',
  r_el: 'Right elbow',
  r_wr: 'Right wrist',
  l_hip: 'Left hip',
  l_kn: 'Left knee',
  l_an: 'Left ankle',
  r_hip: 'Right hip',
  r_kn: 'Right knee',
  r_an: 'Right ankle',
};

// Joints with two clear adjacent bones — angle is well-defined.
// Joints not listed here render '—' for angle and angular velocity.
// `parent` is the proximal neighbour, `child` the distal neighbour;
// angle is between vectors (joint→parent) and (joint→child).
export const JOINT_ANGLE_ADJACENCY: Partial<
  Record<JointName, { parent: JointName; child: JointName }>
> = {
  chest: { parent: 'hip_c', child: 'neck' },
  neck: { parent: 'chest', child: 'head' },
  l_sh: { parent: 'chest', child: 'l_el' },
  l_el: { parent: 'l_sh', child: 'l_wr' },
  r_sh: { parent: 'chest', child: 'r_el' },
  r_el: { parent: 'r_sh', child: 'r_wr' },
  l_hip: { parent: 'hip_c', child: 'l_kn' },
  l_kn: { parent: 'l_hip', child: 'l_an' },
  r_hip: { parent: 'hip_c', child: 'r_kn' },
  r_kn: { parent: 'r_hip', child: 'r_an' },
};

export const JOINT_HEADLINE_CLAIM: Partial<Record<JointName, string>> = {
  l_kn: 'Knee flexion: 92° — within physics-valid range',
  r_kn: 'Knee flexion: 92° — within physics-valid range',
  l_wr: 'Wrist trajectory traced from a single camera',
  r_wr: 'Wrist trajectory traced from a single camera',
  chest: 'Physics-Informed Neural Networks keep the spine plausible',
  head: 'Head pose estimated without facial markers',
  l_an: 'Ankle ground-reaction informed by physics priors',
  r_an: 'Ankle ground-reaction informed by physics priors',
};
