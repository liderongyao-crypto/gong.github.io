// 简化的类名合并函数，不依赖外部库
export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
