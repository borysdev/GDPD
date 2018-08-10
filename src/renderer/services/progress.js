export function ProgressService() {
    return {
        value: 0,
        totalProspects: 1,
        totalMutuals: 1,
        add(val) {
            this.value += val;
        },
        finish() {
            this.value = 100
        },
        stepProspectScan(){
            let perProspect = 80 / this.totalProspects;
            let perProspectScan = (perProspect/2);
            this.add(perProspectScan)
        },
        stepMutualScan(perPage = 9) {
            let perProspect = 80 / this.totalProspects;
            let perProspectScan = (perProspect/2);
            let pages = Math.floor(this.totalMutuals/perPage);
            if(this.totalMutuals%perPage !=0) pages++;
            let perMutualsPage = (perProspect - perProspectScan) / pages;
            this.add(perMutualsPage)
        },
        reset() {
            this.value = 0;
        }
    }
}