export module Config {
    // Configure Node Endpoint
    // export const node_endpoint = "https://scott-api-node.azurewebsites.net/api"; // Prod
    // export const node_endpoint: string = "https://scott-api-node-dev-scott-api-node.azurewebsites.net/api"; // Dev
    export const node_endpoint: string = "http://localhost:8585/api"; // Local

    export const pdf_harvest_endpoint : string = "https://scottservices-pdf.azurewebsites.net/api/PDFHarvester"; // Dev/Prod

    export const auth_token: string = "ae716140-772a-4a60-a005-4f2d28fc21a3";

    export const pushpad_auth_token: string = "8989ab3d126b83fe530fa128672c72ad"; // Dev
    export const pushpad_project_id: number = 2717; // Dev
}
