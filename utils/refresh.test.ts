import { createRefreshHandler } from "@/utils/refresh";

describe("createRefreshHandler", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("sets refreshing true then false and calls completion callback", async () => {
    const setRefreshing = jest.fn();
    const onComplete = jest.fn().mockResolvedValue(undefined);
    const refresh = createRefreshHandler(setRefreshing, onComplete, 900);

    refresh();
    expect(setRefreshing).toHaveBeenCalledWith(true);

    jest.advanceTimersByTime(900);
    await Promise.resolve();

    expect(setRefreshing).toHaveBeenCalledWith(false);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
