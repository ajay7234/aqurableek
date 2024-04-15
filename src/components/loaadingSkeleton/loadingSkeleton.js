import Skeleton from "react-loading-skeleton";

const LoadingSkeleton = () => {
  return (
    <div className="2xl:max-w-[1300px] 2xl:w-[60%] xl:w-[70%] lg:w-[80%] w-full sm:mx-auto">
      <div className="p-[20px] border-b-[#c0bbbb] border-b-[1px] flex items-start">
        <div className="flex items-start gap-[20px] w-full">
          <div>
            <Skeleton circle={true} height={50} width={50} />
          </div>
          <div className="w-full">
            <div className="flex items-center gap-1">
              <h2>
                <Skeleton width={140} height={20} />
              </h2>
              {/* <Skeleton circle={true} height={14} width={14} /> */}
            </div>
            <div className="flex gap-[6px] items-center flex-wrap">
              <p>
                <Skeleton width={100} height={12} />
              </p>
              {/* <div className="w-[4px] h-[4px] rounded-full bg-[#a1a1a1]" />
              <p>
                <Skeleton width={150} height={12} />
              </p> */}
            </div>

            <p>
              <Skeleton count={2} />
            </p>
            {/* <div className="flex justify-end">
            <Skeleton height={170} width={300} />
          </div> */}

            <div className="flex items-center gap-[24px] mt-[20px] flex-wrap">
              <div className="flex gap-[6px] items-center">
                <Skeleton circle={true} height={24} width={24} />
                <Skeleton width={30} height={16} />
              </div>
              <div className="flex gap-[6px] items-center">
                <Skeleton circle={true} height={24} width={24} />
                <Skeleton width={30} height={16} />
              </div>
              <div className="flex gap-[6px] items-center">
                <Skeleton circle={true} height={24} width={24} />
                <Skeleton width={30} height={16} />
              </div>
              <div className="flex gap-[6px] items-center">
                <Skeleton circle={true} height={24} width={24} />
              </div>
            </div>
          </div>
        </div>
        {/* <p>
          <Skeleton width={200} height={12} />
        </p> */}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
