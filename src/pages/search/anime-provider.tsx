import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    createContext
} from 'react';

// 创建 Context 来共享容器宽度
interface ContainerContextType {
    width: number;
    setObserverRef: (ref: HTMLElement | null) => void;
}

const ContainerContext = createContext<ContainerContextType>({
    width: 0,
    setObserverRef: () => {}
});

// 容器宽度提供者组件
interface ContaineProviderProps {
    children: React.ReactNode;
}

const ContainerProvider: React.FC<ContaineProviderProps> = ({ children }) => {
    const [width, setWidth] = useState(0);
    const observerRef = useRef<ResizeObserver | null>(null);
    const elementRef = useRef<HTMLElement | null>(null);

    const setObserverRef = useCallback((ref: HTMLElement | null) => {
        // 如果已经有相同的 ref，直接返回
        if (elementRef.current === ref) return;

        // 清理旧的观察者
        if (observerRef.current && elementRef.current) {
            observerRef.current.unobserve(elementRef.current);
        }

        elementRef.current = ref;

        if (!ref) return;

        // 创建新的观察者（如果还没有的话）
        if (!observerRef.current) {
            observerRef.current = new ResizeObserver(entries => {
                const { width } = entries[0].contentRect;
                setWidth(width);
            });
        }

        // 观察新的元素
        observerRef.current.observe(ref);

        // 初始化设置宽度
        setWidth(ref.clientWidth);
    }, []);

    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    return (
        <ContainerContext.Provider value={{ width, setObserverRef }}>
            {children}
        </ContainerContext.Provider>
    );
};

export { ContainerProvider, ContainerContext };
