import Image from "next/image";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
      <div className="flex items-center justify-center min-h-[270px]">
        <Image src="/outer_circle.png" width={100} height={100} alt="Jobs Are Currently Loading..." className="rotate_animation_class"/>
        
      </div>
    )
  }