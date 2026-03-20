import clsx from "clsx";
import imgCanvas from "@/assets/675789d608bd83eb1eb6e7230de0d52788697af6.png";
type ContainerBackgroundImageProps = {
  additionalClassNames?: string;
};

function ContainerBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<ContainerBackgroundImageProps>) {
  return (
    <div className={clsx("relative w-[166.813px]", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">{children}</div>
    </div>
  );
}
type SpanBackgroundImageAndTextProps = {
  text: string;
};

function SpanBackgroundImageAndText({ text }: SpanBackgroundImageAndTextProps) {
  return (
    <div className="flex-[1_0_0] h-[12.75px] min-h-px min-w-px relative">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[12.75px] left-0 text-[8.5px] text-[rgba(255,255,255,0.12)] top-px tracking-[1.275px] uppercase">{text}</p>
      </div>
    </div>
  );
}

export default function PlatoLiquid() {
  return (
    <div className="bg-white relative size-full" data-name="Plato-Liquid">
      <div className="absolute bg-black h-[944px] left-0 overflow-clip top-0 w-[1549px]" data-name="div">
        <div className="absolute h-[944px] left-0 top-0 w-[1549px]" data-name="canvas">
          <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgCanvas} />
        </div>
        <div className="absolute h-[944px] left-0 top-0 w-[1549px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1549 944\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -64.192 -105.33 0 774.5 434.24)\\'><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.28\\'/><stop stop-color=\\'rgba(0,0,0,0.78)\\' offset=\\'1\\'/></radialGradient></defs></svg>')" }} />
        <div className="absolute content-stretch flex flex-col h-[31.547px] items-start left-[32px] top-[28px] w-[155.219px]" data-name="Container">
          <div className="h-[18.047px] relative shrink-0 w-full" data-name="Container">
            <p className="absolute font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[18.05px] left-0 text-[9.5px] text-[rgba(255,255,255,0.16)] top-px tracking-[2.28px] uppercase">17,339 particles</p>
          </div>
          <div className="h-[13.5px] relative shrink-0 w-full" data-name="Container">
            <p className="absolute font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[13.5px] left-0 text-[9px] text-[rgba(255,255,255,0.08)] top-0 tracking-[1.8px] uppercase">spring · damped physics</p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col gap-[9px] h-[56.25px] items-end left-[1350.19px] top-[28px] w-[166.813px]" data-name="Container">
          <div className="h-[12.75px] relative shrink-0 w-[107.344px]" data-name="Container">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
              <SpanBackgroundImageAndText text="IDLE — formed" />
              <div className="bg-[rgba(230,220,200,0.55)] h-[2px] rounded-[1px] shrink-0 w-[22px]" data-name="Container" />
            </div>
          </div>
          <ContainerBackgroundImage additionalClassNames="h-[12.75px] shrink-0">
            <SpanBackgroundImageAndText text="DISTURBED — liquid flow" />
            <div className="bg-[rgba(140,165,210,0.55)] h-[2px] rounded-[1px] shrink-0 w-[22px]" data-name="Container" />
          </ContainerBackgroundImage>
          <ContainerBackgroundImage additionalClassNames="flex-[1_0_0] min-h-px min-w-px">
            <SpanBackgroundImageAndText text="REFORMING — spring back" />
            <div className="bg-[rgba(170,210,185,0.5)] h-[2px] rounded-[1px] shrink-0 w-[22px]" data-name="Container" />
          </ContainerBackgroundImage>
        </div>
        <div className="absolute h-[68px] left-[570.43px] top-[848px] w-[408px]" data-name="Container">
          <div className="absolute h-[19.5px] left-0 top-0 w-[408.141px]" data-name="Container">
            <p className="-translate-x-1/2 absolute font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[19.5px] left-[204.14px] text-[13px] text-[rgba(255,255,255,0.38)] text-center top-px tracking-[4.55px] uppercase">P L A T O</p>
          </div>
          <div className="absolute h-[19px] left-0 top-[26.5px] w-[408.141px]" data-name="Container">
            <p className="-translate-x-1/2 absolute font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[19px] left-[203.84px] text-[10px] text-[rgba(255,255,255,0.16)] text-center top-0 tracking-[2px] uppercase">428 – 348 BC · Athenian Philosopher</p>
          </div>
          <div className="absolute h-[13.5px] left-0 top-[54.5px] w-[408.141px]" data-name="Container">
            <p className="-translate-x-1/2 absolute font-['JetBrains_Mono:Regular',sans-serif] font-normal leading-[13.5px] left-[204.5px] text-[9px] text-[rgba(255,255,255,0.11)] text-center top-0 tracking-[1.53px] uppercase">Move mouse through the statue — particles flow back like liquid</p>
          </div>
        </div>
      </div>
      <div className="absolute bg-[rgba(255,255,255,0.88)] left-[228px] rounded-[6px] shadow-[0px_0px_8px_0px_rgba(200,215,255,0.35),0px_0px_22px_0px_rgba(160,185,255,0.14)] size-[12px] top-[-6px]" data-name="div" />
    </div>
  );
}