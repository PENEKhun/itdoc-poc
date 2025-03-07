import pc from "picocolors";

interface APIErrorResponse {
    response: {
        status: number;
        body: unknown;
    };
}

export class PrettyPrint {
    private static readonly DIVIDER = "━".repeat(50);
    private static readonly DEFAULT_ERROR_MESSAGE = "Unknown error occurred";

    private currentTransaction: {
        method: string;
        url: string;
        headers?: Record<string, unknown>;
        queryParams?: Record<string, unknown>;
        requestBody?: Record<string, unknown>;
    } | null = null;

    // 기본 출력 메서드
    private print(text: string, newLine: boolean = false): void {
        console.log(text);
        if (newLine) console.log();
    }

    // 구분선 출력
    private printDivider(): void {
        this.print("\n" + pc.gray(PrettyPrint.DIVIDER));
    }

    // JSON 데이터를 예쁘게 출력
    private formatJSON(data: Record<string, unknown>): string {
        return pc.gray(JSON.stringify(data, null, 2));
    }

    // 섹션 제목 포맷팅
    private formatTitle(title: string): string {
        return pc.bold(pc.cyan(`\n  ${title}\n`));
    }

    // 트랜잭션 상태 표시
    private formatTransactionStatus(status: number, isError: boolean): string {
        const { color, message } = this.getStatusInfo(status);
        const icon = isError ? "❌" : "✓";
        const title = isError ? "Failed" : "Success";
        return `\n${color(`${icon} Transaction ${title} (${status} ${message})`)}`;
    }

    // 레이블과 값을 포맷팅
    private formatLabelValue(
        label: string,
        value: string | number,
        valueColor: (text: string) => string = pc.yellow,
    ): string {
        return `  ${pc.bold(label.padEnd(12))} ${valueColor(String(value))}`;
    }

    // HTTP 상태 코드에 따른 색상과 메시지
    private getStatusInfo(status: number): { color: (text: string) => string; message: string } {
        if (status >= 200 && status < 300) {
            return { color: pc.green, message: "Success" };
        } else if (status >= 400 && status < 500) {
            return { color: pc.yellow, message: "Client Error" };
        } else if (status >= 500) {
            return { color: pc.red, message: "Server Error" };
        }
        return { color: pc.gray, message: "Unknown" };
    }

    // API 요청 정보 출력
    public printRequest(
        method: string,
        url: string,
        headers?: Record<string, unknown>,
        queryParams?: Record<string, unknown>,
        requestBody?: Record<string, unknown>,
    ): void {
        // 트랜잭션 정보 저장
        this.currentTransaction = {
            method,
            url,
            headers,
            queryParams,
            requestBody,
        };

        this.printDivider();
        this.print(this.formatTitle("REQUEST"));
        this.print(this.formatLabelValue("Method", method, pc.magenta));
        this.print(this.formatLabelValue("URL", url));

        const sections = [
            { label: "Headers", data: headers },
            { label: "Query Params", data: queryParams },
            { label: "Request Body", data: requestBody },
        ];

        sections.forEach(({ label, data }) => {
            if (data && Object.keys(data).length > 0) {
                this.print(`\n  ${pc.bold(label)}:`);
                this.print(`${this.formatJSON(data)}`);
            }
        });
    }

    // API 응답 정보 출력
    public printResponse(status: number, body: unknown): void {
        if (!this.currentTransaction) {
            throw new Error("No active transaction found. Call printRequest first.");
        }

        const isError = status >= 400;

        // 현재 출력된 구분선을 지우고 트랜잭션 상태부터 출력
        process.stdout.write("\x1b[1A\x1b[2K");
        this.printDivider();
        this.print(this.formatTransactionStatus(status, isError));

        // Request 정보 다시 출력
        this.print(this.formatTitle("REQUEST"));
        this.print(this.formatLabelValue("Method", this.currentTransaction.method, pc.magenta));
        this.print(this.formatLabelValue("URL", this.currentTransaction.url));

        const requestSections = [
            { label: "Headers", data: this.currentTransaction.headers },
            { label: "Query Params", data: this.currentTransaction.queryParams },
            { label: "Request Body", data: this.currentTransaction.requestBody },
        ];

        requestSections.forEach(({ label, data }) => {
            if (data && Object.keys(data).length > 0) {
                this.print(`\n  ${pc.bold(label)}:`);
                this.print(`${this.formatJSON(data)}`);
            }
        });

        // Response 정보 출력
        this.print(this.formatTitle("RESPONSE"));
        this.print(this.formatLabelValue("Status", `${status}`, this.getStatusInfo(status).color));

        if (body && typeof body === "object" && Object.keys(body).length > 0) {
            this.print(`\n  ${pc.bold("Response Body")}:`);
            this.print(`${this.formatJSON(body as Record<string, unknown>)}`);
        }

        this.printDivider();
        this.currentTransaction = null; // 트랜잭션 종료
    }

    // 에러 출력
    public printError(error: unknown): void {
        if (this.isAPIError(error)) {
            this.printAPIError(error);
        } else {
            this.printGeneralError(error as Error);
        }
    }

    // API 에러인지 확인
    private isAPIError(error: unknown): error is APIErrorResponse {
        if (!error || typeof error !== "object") return false;
        if (!("response" in error)) return false;

        const response = (error as APIErrorResponse).response;
        return (
            typeof response === "object" &&
            response !== null &&
            "status" in response &&
            "body" in response
        );
    }

    // 일반 에러 출력
    private printGeneralError(error: Error | string): void {
        const message =
            typeof error === "string" ? error : error.message || PrettyPrint.DEFAULT_ERROR_MESSAGE;

        this.print(this.formatTitle("❌ ERROR"));
        this.print(this.formatLabelValue("Message", message, pc.red));
        this.printDivider();
    }

    // API 에러 출력
    private printAPIError(error: APIErrorResponse): void {
        const { status, body } = error.response;
        const { color, message } = this.getStatusInfo(status);

        this.print(this.formatTitle("❌ API ERROR"));
        this.print(this.formatLabelValue("Status", `${status} (${message})`, color));

        if (body && typeof body === "object" && Object.keys(body).length > 0) {
            this.print(`\n  ${pc.bold("Error Details")}:`);
            this.print(`${this.formatJSON(body as Record<string, unknown>)}`);
        }
        this.printDivider();
    }
}
